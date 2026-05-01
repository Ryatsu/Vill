package backend.Service;

import backend.Entity.Item;
import backend.Repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(String id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found: " + id));
    }

    public Item registerItem(Item item) {
        item.setDateRegistered(new Date());
        return itemRepository.save(item);
    }

    public Item buyItem(String id) {
        Item item = getItemById(id);
        item.setDateBought(new Date());
        return itemRepository.save(item);
    }

    public Item updateItem(String id, Item newItem) {
        Item item = getItemById(id);

        item.setName(newItem.getName());
        item.setPrice(newItem.getPrice());
        item.setCost(newItem.getCost());

        return itemRepository.save(item);
    }

    public void deleteItem(String id) {
        itemRepository.deleteById(id);
    }
}