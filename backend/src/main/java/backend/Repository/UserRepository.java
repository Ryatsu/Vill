package backend.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import backend.Entity.User;

public interface UserRepository extends MongoRepository<User, String> {
	Optional<User> findByUsername(String username);
}