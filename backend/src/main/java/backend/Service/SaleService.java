package backend.Service;

import backend.Entity.Item;
import backend.Entity.Sale;
import backend.Repository.ItemRepository;
import backend.Repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class SaleService {

    private final SaleRepository saleRepo;
    private final ItemRepository itemRepo;

    public SaleService(SaleRepository saleRepo, ItemRepository itemRepo) {
        this.saleRepo = saleRepo;
        this.itemRepo = itemRepo;
    }

    public Sale recordSale(String itemId, int qty, Double unitPrice, String saleType) {
        Item item = itemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        double priceToUse = (unitPrice != null) ? unitPrice : item.getPrice();

        Sale sale = new Sale();
        sale.setItemId(itemId);
        sale.setItemName(item.getName());
        sale.setPrice(priceToUse);
        sale.setQuantity(qty);
        sale.setTotal(priceToUse * qty);
        sale.setDate(new Date());
        sale.setSaleType(saleType);

        return saleRepo.save(sale);
    }

    public Sale recordManualSale(String description, int qty, Double unitPrice, String saleType) {
        if (description == null || description.trim().isEmpty()) {
            throw new RuntimeException("Description is required");
        }

        double priceToUse = (unitPrice != null) ? unitPrice : 0.0;

        Sale sale = new Sale();
        sale.setItemId(null);
        sale.setItemName(description.trim());
        sale.setPrice(priceToUse);
        sale.setQuantity(qty);
        sale.setTotal(priceToUse * qty);
        sale.setDate(new Date());
        sale.setSaleType(saleType);

        return saleRepo.save(sale);
    }

    public List<Sale> getAllSales() {
        return saleRepo.findAll();
    }

    public void deleteSale(String id) {
        saleRepo.deleteById(id);
    }
}