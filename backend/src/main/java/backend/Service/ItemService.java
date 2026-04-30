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
				.orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
	}

	public Item saveItem(Item item) {
		// set registration date if not provided
		if (item.getDateRegistered() == null) {
			item.setDateRegistered(new Date());
		}
		return itemRepository.save(item);
	}

	public Item registerItem(Item item) {
		return saveItem(item);
	}

	public Item buyItem(String id) {
		Item item = getItemById(id);
		item.setDateBought(new Date());
		return itemRepository.save(item);
	}

	public Item updateItem(String id, Item itemDetails) {
		Item item = getItemById(id);

		item.setName(itemDetails.getName());
		item.setPrice(itemDetails.getPrice());
		item.setCost(itemDetails.getCost());

		return itemRepository.save(item);
	}

	public void deleteItem(String id) {
		itemRepository.deleteById(id);
	}
}
