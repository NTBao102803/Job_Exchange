package iuh.fit.se.payment_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SepayTransactionDTO {

    @JsonProperty("id")
    private String id;

    @JsonProperty("bank_brand_name")
    private String bankBrandName;

    @JsonProperty("account_number")
    private String accountNumber;

    @JsonProperty("transaction_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime transactionDate;

    @JsonProperty("amount_in")
    private Double amountIn;

    @JsonProperty("amount_out")
    private Double amountOut;

    @JsonProperty("accumulated")
    private Double accumulated;

    @JsonProperty("transaction_content")
    private String transactionContent;

    @JsonProperty("reference_number")
    private String referenceNumber;

    @JsonProperty("code")
    private String code;

    @JsonProperty("sub_account")
    private String subAccount;

    @JsonProperty("bank_account_id")
    private String bankAccountId;
}