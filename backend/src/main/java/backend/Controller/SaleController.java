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
    public Sale sell(@PathVariable String itemId, @RequestBody SaleRequest request) {
        return service.recordSale(itemId, request.getQty(), request.getUnitPrice(), request.getSaleType());
    }

    @PostMapping("/manual")
    public Sale sellManual(@RequestBody SaleRequest request) {
        return service.recordManualSale(
                request.getDescription(),
                request.getQty(),
                request.getUnitPrice(),
                request.getSaleType()
        );
    }

    @GetMapping
    public List<Sale> all() {
        return service.getAllSales();
    }

    @DeleteMapping("/{id}")
    public void deleteSale(@PathVariable String id) {
        service.deleteSale(id);
    }
}