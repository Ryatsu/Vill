package backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import backend.Entity.User;
import backend.Repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository repo;

    @GetMapping
    public List<User> getUsers() {
        return repo.findAll();
    }

    @PostMapping
    public User addUser(@RequestBody User user) {
        return repo.save(user);
    }
}