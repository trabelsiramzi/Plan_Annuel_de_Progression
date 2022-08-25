package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Competance.
 */
@Entity
@Table(name = "competance")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Competance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nom_competance")
    private String nomCompetance;

    @Column(name = "description")
    private String description;

    @Column(name = "niveau")
    private Integer niveau;

    @ManyToMany(mappedBy = "competances")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "entretiens", "manager", "teamlead", "affectations", "competances" }, allowSetters = true)
    private Set<Employee> employees = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Competance id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomCompetance() {
        return this.nomCompetance;
    }

    public Competance nomCompetance(String nomCompetance) {
        this.setNomCompetance(nomCompetance);
        return this;
    }

    public void setNomCompetance(String nomCompetance) {
        this.nomCompetance = nomCompetance;
    }

    public String getDescription() {
        return this.description;
    }

    public Competance description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getNiveau() {
        return this.niveau;
    }

    public Competance niveau(Integer niveau) {
        this.setNiveau(niveau);
        return this;
    }

    public void setNiveau(Integer niveau) {
        this.niveau = niveau;
    }

    public Set<Employee> getEmployees() {
        return this.employees;
    }

    public void setEmployees(Set<Employee> employees) {
        if (this.employees != null) {
            this.employees.forEach(i -> i.removeCompetance(this));
        }
        if (employees != null) {
            employees.forEach(i -> i.addCompetance(this));
        }
        this.employees = employees;
    }

    public Competance employees(Set<Employee> employees) {
        this.setEmployees(employees);
        return this;
    }

    public Competance addEmployee(Employee employee) {
        this.employees.add(employee);
        employee.getCompetances().add(this);
        return this;
    }

    public Competance removeEmployee(Employee employee) {
        this.employees.remove(employee);
        employee.getCompetances().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Competance)) {
            return false;
        }
        return id != null && id.equals(((Competance) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Competance{" +
            "id=" + getId() +
            ", nomCompetance='" + getNomCompetance() + "'" +
            ", description='" + getDescription() + "'" +
            ", niveau=" + getNiveau() +
            "}";
    }
}
