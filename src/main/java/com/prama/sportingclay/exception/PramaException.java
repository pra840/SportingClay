package com.prama.sportingclay.exception;

/**
 * Created by pmallapur on 6/20/2016.
 */
public class PramaException extends RuntimeException {

    private Integer exceptionId;
    private String exceptionMessage;

    public PramaException(Integer exceptionId, String exceptionMessage) {
        this.exceptionId = exceptionId;
        this.exceptionMessage = exceptionMessage;
    }

    public String getExceptionMessage() {
        return exceptionMessage;
    }

    public void setExceptionMessage(String exceptionMessage) {
        this.exceptionMessage = exceptionMessage;
    }

    public Integer getExceptionId() {
        return exceptionId;
    }

    public void setExceptionId(Integer exceptionId) {
        this.exceptionId = exceptionId;
    }
}
