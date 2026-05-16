package backend.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "cash_records")
public class CashRecord {

    @Id
    private String id;

    private String type; 
    private String personName;
    private String description;
    private double amount;
    private double paidAmount = 0.0;
    private boolean paid;
    private Date date;
    private Date recordedAt;
    private List<String> saleIds = new ArrayList<>(); // track sales created from payments

    public CashRecord() {}

    public String getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public String getPersonName() {
        return personName;
    }

    public double getAmount() {
        return amount;
    }

    public double getPaidAmount() {
        return paidAmount;
    }

    public double getRemainingAmount() {
        return amount - paidAmount;
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

    public void setPersonName(String personName) {
        this.personName = personName;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setPaidAmount(double paidAmount) {
        this.paidAmount = paidAmount;
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

    public List<String> getSaleIds() {
        return saleIds;
    }

    public void setSaleIds(List<String> saleIds) {
        this.saleIds = saleIds;
    }

    public void addSaleId(String saleId) {
        if (this.saleIds == null) {
            this.saleIds = new ArrayList<>();
        }
        this.saleIds.add(saleId);
    }
}