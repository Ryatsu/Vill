package backend.Service;

import backend.Entity.CashRecord;
import backend.Repository.CashRecordRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class CashRecordService {

    private final CashRecordRepository repo;

    public CashRecordService(CashRecordRepository repo) {
        this.repo = repo;
    }

    public List<CashRecord> getAll() {
        return repo.findAll();
    }

    public CashRecord create(CashRecord record) {
        record.setRecordedAt(new Date());
        record.setPaid(false);
        return repo.save(record);
    }

    public CashRecord markPaid(String id) {
        CashRecord r = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        r.setPaid(true);
        return repo.save(r);
    }

    public CashRecord markUnpaid(String id) {
        CashRecord r = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        r.setPaid(false);
        return repo.save(r);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}