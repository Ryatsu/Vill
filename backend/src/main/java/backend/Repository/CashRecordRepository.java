package backend.Repository;

import backend.Entity.CashRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;

public interface CashRecordRepository extends MongoRepository<CashRecord, String> {
    @Query("{ 'recordedAt': { $lt: ?0 } }")
    List<CashRecord> findRecordsOlderThan(Date date);
}