package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Entretien.
 */
@Entity
@Table(name = "entretien")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Entretien implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "dateentretient")
    private Instant dateentretient;

    @Column(name = "resultat")
    private String resultat;

    @Column(name = "confirmationresponsable")
    private String confirmationresponsable;

    @Column(name = "confirmationsalarie")
    private String confirmationsalarie;

    @ManyToOne
    @JsonIgnoreProperties(value = { "entretiens", "affectation", "affectationAdmin" }, allowSetters = true)
    private Employee employee;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Entretien id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDateentretient() {
        return this.dateentretient;
    }

    public Entretien dateentretient(Instant dateentretient) {
        this.setDateentretient(dateentretient);
        return this;
    }

    public void setDateentretient(Instant dateentretient) {
        this.dateentretient = dateentretient;
    }

    public String getResultat() {
        return this.resultat;
    }

    public Entretien resultat(String resultat) {
        this.setResultat(resultat);
        return this;
    }

    public void setResultat(String resultat) {
        this.resultat = resultat;
    }

    public String getConfirmationresponsable() {
        return this.confirmationresponsable;
    }

    public Entretien confirmationresponsable(String confirmationresponsable) {
        this.setConfirmationresponsable(confirmationresponsable);
        return this;
    }

    public void setConfirmationresponsable(String confirmationresponsable) {
        this.confirmationresponsable = confirmationresponsable;
    }

    public String getConfirmationsalarie() {
        return this.confirmationsalarie;
    }

    public Entretien confirmationsalarie(String confirmationsalarie) {
        this.setConfirmationsalarie(confirmationsalarie);
        return this;
    }

    public void setConfirmationsalarie(String confirmationsalarie) {
        this.confirmationsalarie = confirmationsalarie;
    }

    public Employee getEmployee() {
        return this.employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Entretien employee(Employee employee) {
        this.setEmployee(employee);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Entretien)) {
            return false;
        }
        return id != null && id.equals(((Entretien) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Entretien{" +
            "id=" + getId() +
            ", dateentretient='" + getDateentretient() + "'" +
            ", resultat='" + getResultat() + "'" +
            ", confirmationresponsable='" + getConfirmationresponsable() + "'" +
            ", confirmationsalarie='" + getConfirmationsalarie() + "'" +
            "}";
    }
}
