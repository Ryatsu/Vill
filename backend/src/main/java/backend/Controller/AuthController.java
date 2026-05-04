package backend.Controller;

import backend.config.JwtTokenProvider;
import backend.Entity.User;
import backend.Repository.UserRepository;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

record LoginRequest(String username, String password) {}
record RegisterRequest(String name, String username, String password) {}
record AuthResponse(String token) {}

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private JwtTokenProvider jwtProvider;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.findByUsername(req.username()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "username_taken"));
        }
        User user = new User();
        user.setName(req.name());
        user.setUsername(req.username());
        user.setPassword(passwordEncoder.encode(req.password()));
        userRepo.save(user);
        String token = jwtProvider.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        var opt = userRepo.findByUsername(request.username());
        if (opt.isEmpty()) return ResponseEntity.status(401).body(Map.of("error", "invalid_credentials"));
        User user = opt.get();
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid_credentials"));
        }
        String token = jwtProvider.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}