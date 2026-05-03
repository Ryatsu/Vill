package backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {

        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
		System.setProperty("MONGODB_URI", dotenv.get("MONGODB_URI"));

		SpringApplication.run(BackendApplication.class, args);
		System.out.println("Server Running...");
	}

}
