package backend.Repository;

import backend.Entity.CashRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CashRecordRepository extends MongoRepository<CashRecord, String> {
}