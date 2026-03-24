package com.vps.util;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.vps.entity.FeeRecord;
import com.vps.entity.Student;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Component
public class PdfGenerator {

    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(25, 25, 112);
    private static final DeviceRgb ACCENT_COLOR = new DeviceRgb(70, 130, 180);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a");

    public byte[] generateFeeReceipt(FeeRecord fee, Student student) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document doc = new Document(pdfDoc, PageSize.A4);
            doc.setMargins(20, 30, 20, 30);
 
            // ----- Branding Header -----
            Table brandingTable = new Table(UnitValue.createPercentArray(new float[]{1, 4}))
                    .useAllAvailableWidth()
                    .setMarginBottom(10);

            // Add Logo if exists
            try {
                String logoPath = "d:/Admin_VPS/frontend/public/vps_app_icon_192.png";
                Image logo = new Image(ImageDataFactory.create(logoPath))
                        .setWidth(60)
                        .setHorizontalAlignment(HorizontalAlignment.CENTER);
                brandingTable.addCell(new Cell().add(logo).setBorder(Border.NO_BORDER).setVerticalAlignment(VerticalAlignment.MIDDLE));
            } catch (Exception e) {
                // Fallback for logo
                brandingTable.addCell(new Cell().add(new Paragraph("VPS").setBold().setFontSize(20).setFontColor(PRIMARY_COLOR))
                        .setBorder(Border.NO_BORDER).setVerticalAlignment(VerticalAlignment.MIDDLE));
            }

            // School Info
            brandingTable.addCell(new Cell()
                    .add(new Paragraph("VISION PUBLIC SCHOOL").setBold().setFontSize(20).setFontColor(PRIMARY_COLOR))
                    .add(new Paragraph("Your Path to Excellence").setFontSize(10).setItalic())
                    .setBorder(Border.NO_BORDER)
                    .setTextAlignment(TextAlignment.LEFT)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE)
            );
            doc.add(brandingTable);

            doc.add(new Paragraph("FEE PAYMENT RECEIPT")
                    .setBold().setFontSize(14).setTextAlignment(TextAlignment.CENTER).setMarginBottom(20)
                    .setBorderBottom(new SolidBorder(ColorConstants.BLACK, 1f)));

            // ----- Info Table -----
            Table infoTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                    .useAllAvailableWidth()
                    .setFontSize(10)
                    .setMarginBottom(20);

            addInfoRow(infoTable, "Receipt No.", "VPS-" + String.format("%06d", fee.getId()));
            addInfoRow(infoTable, "Student Name", student.getFullName());
            addInfoRow(infoTable, "Student ID", student.getStudentId());
            addInfoRow(infoTable, "Class", student.getClassForAdmission() != null ? student.getClassForAdmission() : "N/A");
            addInfoRow(infoTable, "Academic Year", student.getAcademicYear() != null ? student.getAcademicYear() : "2025-2026");
            addInfoRow(infoTable, "Fee Type", fee.getFeeType() != null ? fee.getFeeType() : "General Fee");
            addInfoRow(infoTable, "Amount Paid", fee.getAmount().toString());
            addInfoRow(infoTable, "Payment Mode", fee.getPaymentMode().toString());
            addInfoRow(infoTable, "Transaction ID", fee.getTransactionId() != null ? fee.getTransactionId() : "N/A");
            addInfoRow(infoTable, "Payment Date", fee.getPaidAt() != null ? fee.getPaidAt().format(DATE_FMT) : "N/A");
            addInfoRow(infoTable, "Verified Date", fee.getVerifiedAt() != null ? fee.getVerifiedAt().format(DATE_FMT) : "N/A");
            addInfoRow(infoTable, "Status", fee.getStatus().toString());

            doc.add(infoTable);

            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF receipt", e);
        }
    }

    private void addInfoRow(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label).setBold()).setBorder(Border.NO_BORDER).setPadding(5));
        table.addCell(new Cell().add(new Paragraph(value != null ? value : "N/A")).setBorder(Border.NO_BORDER)
                .setBorderBottom(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f)).setPadding(5));
    }
 
    private static class NumberToWords {
        private static final String[] units = {"", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"};
        private static final String[] tens = {"", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"};
 
        public static String convert(long n) {
            if (n < 0) return "Minus " + convert(-n);
            if (n < 20) return units[(int) n];
            if (n < 100) return tens[(int) n / 10] + ((n % 10 != 0) ? " " : "") + units[(int) n % 10];
            if (n < 1000) return units[(int) n / 100] + " Hundred" + ((n % 100 != 0) ? " " : "") + convert(n % 100);
            if (n < 100000) return convert(n / 1000) + " Thousand" + ((n % 1000 != 0) ? " " : "") + convert(n % 1000);
            if (n < 10000000) return convert(n / 100000) + " Lakh" + ((n % 100000 != 0) ? " " : "") + convert(n % 100000);
            return convert(n / 10000000) + " Crore" + ((n % 10000000 != 0) ? " " : "") + convert(n % 10000000);
        }
    }
}
