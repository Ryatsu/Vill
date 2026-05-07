package backend.Controller;

import backend.Entity.CashRecord;
import backend.Service.CashRecordService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cash")
@CrossOrigin("*")
public class CashRecordController {

    private final CashRecordService service;

    public CashRecordController(CashRecordService service) {
        this.service = service;
    }

    @GetMapping
    public List<CashRecord> getAll() {
        return service.getAll();
    }

    @PostMapping
    public CashRecord create(@RequestBody CashRecordRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}/pay")
    public CashRecord markPaid(@PathVariable String id) {
        return service.markPaid(id);
    }

    @PutMapping("/{id}/payment")
    public CashRecord makePayment(@PathVariable String id, @RequestBody PaymentRequest request) {
        return service.makePayment(id, request);
    }

    @PutMapping("/{id}/unpay")
    public CashRecord markUnpaid(@PathVariable String id) {
        return service.markUnpaid(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}