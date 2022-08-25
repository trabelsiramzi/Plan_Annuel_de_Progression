package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AffectationAdmin.
 */
@Entity
@Table(name = "affectation_admin")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AffectationAdmin implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "datedebut")
    private Instant datedebut;

    @Column(name = "datefin")
    private Instant datefin;

    @ManyToOne
    @JsonIgnoreProperties(value = { "affectationAdmins" }, allowSetters = true)
    private Etablissement etablissement;

    @OneToMany(mappedBy = "affectationAdmin")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "entretiens", "affectation", "affectationAdmin" }, allowSetters = true)
    private Set<Employee> employees = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AffectationAdmin id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDatedebut() {
        return this.datedebut;
    }

    public AffectationAdmin datedebut(Instant datedebut) {
        this.setDatedebut(datedebut);
        return this;
    }

    public void setDatedebut(Instant datedebut) {
        this.datedebut = datedebut;
    }

    public Instant getDatefin() {
        return this.datefin;
    }

    public AffectationAdmin datefin(Instant datefin) {
        this.setDatefin(datefin);
        return this;
    }

    public void setDatefin(Instant datefin) {
        this.datefin = datefin;
    }

    public Etablissement getEtablissement() {
        return this.etablissement;
    }

    public void setEtablissement(Etablissement etablissement) {
        this.etablissement = etablissement;
    }

    public AffectationAdmin etablissement(Etablissement etablissement) {
        this.setEtablissement(etablissement);
        return this;
    }

    public Set<Employee> getEmployees() {
        return this.employees;
    }

    public void setEmployees(Set<Employee> employees) {
        if (this.employees != null) {
            this.employees.forEach(i -> i.setAffectationAdmin(null));
        }
        if (employees != null) {
            employees.forEach(i -> i.setAffectationAdmin(this));
        }
        this.employees = employees;
    }

    public AffectationAdmin employees(Set<Employee> employees) {
        this.setEmployees(employees);
        return this;
    }

    public AffectationAdmin addEmployee(Employee employee) {
        this.employees.add(employee);
        employee.setAffectationAdmin(this);
        return this;
    }

    public AffectationAdmin removeEmployee(Employee employee) {
        this.employees.remove(employee);
        employee.setAffectationAdmin(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AffectationAdmin)) {
            return false;
        }
        return id != null && id.equals(((AffectationAdmin) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AffectationAdmin{" +
            "id=" + getId() +
            ", datedebut='" + getDatedebut() + "'" +
            ", datefin='" + getDatefin() + "'" +
            "}";
    }
}
