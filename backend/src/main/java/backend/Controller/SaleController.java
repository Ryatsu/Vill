package backend.Controller;

import backend.Entity.Sale;
import backend.Service.SaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin("*")
public class SaleController {

    private final SaleService service;

    public SaleController(SaleService service) {
        this.service = service;
    }

    @PostMapping("/{itemId}")
    public Sale sell(@PathVariable String itemId, @RequestParam int qty) {
        return service.recordSale(itemId, qty);
    }

    @GetMapping
    public List<Sale> all() {
        return service.getAllSales();
    }
}