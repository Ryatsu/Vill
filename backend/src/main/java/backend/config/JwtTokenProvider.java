@Component
public class JwtTokenProvider {
    @Value("${jwt.secret:your-secret-key-min-256-bits}")
    private String jwtSecret;
    
    @Value("${jwt.expiration:86400000}") // 24 hours
    private long jwtExpiration;
    
    public String generateToken(String username) {
        return Jwts.builder()
            .subject(username)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
            .compact();
    }
    
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
}