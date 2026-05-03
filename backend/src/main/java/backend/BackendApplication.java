package backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {

        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		String mongoUri = dotenv.get("MONGODB_URI");
		if (mongoUri != null) {
			System.setProperty("MONGODB_URI", mongoUri);
		}

		SpringApplication.run(BackendApplication.class, args);
		System.out.println("Server Running...");
	}

}
