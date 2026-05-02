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

    public Sale recordSale(String itemId, int qty) {
        Item item = itemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        Sale sale = new Sale();
        sale.setItemId(itemId);
        sale.setItemName(item.getName());
        sale.setPrice(item.getPrice());
        sale.setQuantity(qty);
        sale.setTotal(item.getPrice() * qty);
        sale.setDate(new Date());

        return saleRepo.save(sale);
    }

    public List<Sale> getAllSales() {
        return saleRepo.findAll();
    }
}