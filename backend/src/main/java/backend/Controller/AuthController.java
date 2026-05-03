package backend.Controller;

import backend.config.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

record LoginRequest(String username) {}

record AuthResponse(String token) {}

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private JwtTokenProvider jwtProvider;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Validate credentials against your database
        String token = jwtProvider.generateToken(request.username());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}