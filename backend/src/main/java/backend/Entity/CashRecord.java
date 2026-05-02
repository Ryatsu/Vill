package backend.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "cash_records")
public class CashRecord {

    @Id
    private String id;

    private String type; // UNPAID_ITEM, BORROWED, LOAN
    private String description;
    private double amount;
    private boolean paid;
    private Date date;
    private Date recordedAt;

    public CashRecord() {}

    // getters & setters
    public String getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public double getAmount() {
        return amount;
    }

    public boolean isPaid() {
        return paid;
    }

    public Date getDate() {
        return date;
    }

    public Date getRecordedAt() {
        return recordedAt;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    public void setDate(Date date) {
        this.date = date;
        this.recordedAt = date;
    }

    public void setRecordedAt(Date recordedAt) {
        this.recordedAt = recordedAt;
        this.date = recordedAt;
    }
}