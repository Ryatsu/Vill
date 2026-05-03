@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private JwtTokenProvider jwtProvider;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Validate credentials against your database
        String token = jwtProvider.generateToken(request.getUsername());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}