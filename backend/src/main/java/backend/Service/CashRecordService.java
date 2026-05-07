package backend.Service;

import backend.Controller.CashRecordRequest;
import backend.Controller.PaymentRequest;
import backend.Entity.CashRecord;
import backend.Entity.Sale;
import backend.Repository.CashRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.List;
import java.util.Calendar;

@Service
public class CashRecordService {

    private final CashRecordRepository repo;
    private final SaleService saleService;
    private static final Logger logger = LoggerFactory.getLogger(CashRecordService.class);

    public CashRecordService(CashRecordRepository repo, SaleService saleService) {
        this.repo = repo;
        this.saleService = saleService;
    }

    public List<CashRecord> getAll() {
        return repo.findAll();
    }

    public CashRecord create(CashRecordRequest request) {
        String personName = request.getPersonName() == null ? "" : request.getPersonName().trim();
        String description = request.getDescription() == null ? "" : request.getDescription().trim();

        if (personName.isEmpty()) {
            throw new RuntimeException("Person name is required");
        }

        if (description.isEmpty()) {
            throw new RuntimeException("Description is required");
        }

        CashRecord record = new CashRecord();
        record.setType(request.getType());
        record.setPersonName(personName);
        record.setDescription(description);
        record.setAmount(request.getAmount());
        record.setRecordedAt(new Date());
        record.setPaid(false);

        return repo.save(record);
    }

    public CashRecord markPaid(String id) {
        CashRecord r = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        double remainingBeforeFullPay = r.getAmount() - r.getPaidAmount();

        // Mark full amount as paid
        r.setPaidAmount(r.getAmount());
        r.setPaid(true);

        // Create a "Cash Out" sale record only for the remaining balance
        if (remainingBeforeFullPay > 0.01) {
            Sale cashOutSale = saleService.recordManualSale("Cash Out", 1, remainingBeforeFullPay, null);
            r.addSaleId(cashOutSale.getId());
            logger.info(
                    "Marked record {} as fully paid. Remaining charged: {}, total paid amount: {}, Sale ID: {}",
                    id,
                    remainingBeforeFullPay,
                    r.getPaidAmount(),
                    cashOutSale.getId()
            );
        } else {
            logger.info("Record {} was already fully paid. No additional sale created.", id);
        }

        return repo.save(r);
    }

    public CashRecord makePayment(String id, PaymentRequest request) {
        if (request.getAmount() <= 0) {
            throw new RuntimeException("Payment amount must be greater than 0");
        }

        CashRecord r = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cash record not found"));

        double newPaidAmount = r.getPaidAmount() + request.getAmount();
        double remaining = r.getAmount() - newPaidAmount;

        if (newPaidAmount > r.getAmount()) {
            throw new RuntimeException("Payment exceeds remaining balance. Remaining: ₱" + String.format("%.2f", r.getRemainingAmount()));
        }

        r.setPaidAmount(newPaidAmount);
        if (Math.abs(remaining) < 0.01) { // account for floating point rounding
            r.setPaid(true);
        }

        // Create a "Cash Out" sale record for the payment and store the ID
        Sale cashOutSale = saleService.recordManualSale("Cash Out", 1, request.getAmount(), null);
        r.addSaleId(cashOutSale.getId());

        logger.info("Payment processed for record {}: paid amount ₱{}, remaining ₱{}, Sale ID: {}", id, newPaidAmount, remaining, cashOutSale.getId());
        return repo.save(r);
    }

    public CashRecord markUnpaid(String id) {
        CashRecord r = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        // Delete all associated sales
        if (r.getSaleIds() != null && !r.getSaleIds().isEmpty()) {
            for (String saleId : r.getSaleIds()) {
                try {
                    saleService.deleteSale(saleId);
                    logger.info("Deleted sale {} for cash record {}", saleId, id);
                } catch (Exception e) {
                    logger.warn("Failed to delete sale {}: {}", saleId, e.getMessage());
                }
            }
            r.getSaleIds().clear();
        }

        r.setPaidAmount(0.0);
        r.setPaid(false);
        logger.info("Reverted record {} to unpaid, deleted all associated sales", id);
        return repo.save(r);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }

    @Scheduled(fixedDelay = 3600000)
    public void deleteRecordsOlderThanTwoDays() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, -2);
        Date cutoffDate = calendar.getTime();

        List<CashRecord> oldRecords = repo.findRecordsOlderThan(cutoffDate);
        if (!oldRecords.isEmpty()) {
            repo.deleteAll(oldRecords);
            logger.info("Deleted {} cash records older than 2 days", oldRecords.size());
        }
    }
}