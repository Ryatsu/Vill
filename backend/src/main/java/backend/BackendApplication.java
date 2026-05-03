package backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {

		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		String jwt = dotenv.get("JWT_SECRET");
		if (jwt != null) {
			System.setProperty("JWT_SECRET", jwt);
		}
		String mongo = dotenv.get("MONGODB_URI");
		if (mongo != null) {
			System.setProperty("MONGODB_URI", mongo);
		}

		SpringApplication.run(BackendApplication.class, args);
		System.out.println("Server Running...");
	}

}
