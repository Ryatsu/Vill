package backend.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import backend.Entity.User;

public interface UserRepository extends MongoRepository<User, String> {

}