// package backend.Controller;

// import backend.Entity.Item;
// import backend.Service.ItemService;
// import jakarta.validation.Valid;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/items")
// @CrossOrigin(origins = "*")
// public class ItemController {

//     private final ItemService itemService;

//     public ItemController(ItemService itemService) {
//         this.itemService = itemService;
//     }

//     @PostMapping("/register")
//     public ResponseEntity<Item> register(@Valid @RequestBody Item item) {
//         return ResponseEntity.ok(itemService.registerItem(item));
//     }

//     @GetMapping
//     public List<Item> getAll() {
//         return itemService.getAllItems();
//     }

//     @GetMapping("/{id}")
//     public Item getById(@PathVariable String id) {
//         return itemService.getItemById(id);
//     }

//     @PutMapping("/{id}/buy")
//     public Item buy(@PathVariable String id) {
//         return itemService.buyItem(id);
//     }

//     @PutMapping("/{id}")
//     public Item update(@PathVariable String id, @RequestBody Item item) {
//         return itemService.updateItem(id, item);
//     }

//     @DeleteMapping("/{id}")
//     public void delete(@PathVariable String id) {
//         itemService.deleteItem(id);
//     }
// }