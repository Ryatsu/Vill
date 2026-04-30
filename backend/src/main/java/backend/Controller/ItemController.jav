package backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import backend.Entity.Item;
import backend.Service.ItemService;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    /**
     * Register a new item
     */
    @PostMapping("/register")
    public ResponseEntity<Item> registerItem(@RequestBody Item item) {
        Item registeredItem = itemService.registerItem(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredItem);
    }

    /**
     * Record when an item is bought
     */
    @PutMapping("/{itemId}/buy")
    public ResponseEntity<Item> buyItem(@PathVariable String itemId) {
        Item boughtItem = itemService.buyItem(itemId);
        return ResponseEntity.ok(boughtItem);
    }

    /**
     * Get item by ID
     */
    @GetMapping("/{itemId}")
    public ResponseEntity<Item> getItem(@PathVariable String itemId) {
        Item item = itemService.getItemById(itemId);
        return ResponseEntity.ok(item);
    }

    /**
     * Get all registered items
     */
    @GetMapping
    public ResponseEntity<?> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    /**
     * Delete an item
     */
    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable String itemId) {
        itemService.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }
}
