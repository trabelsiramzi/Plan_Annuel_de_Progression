package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Task entity.\n@author The JHipster team.
 */
@Schema(description = "Task entity.\n@author The JHipster team.")
@Entity
@Table(name = "affectation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Affectation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nomprojet")
    private String nomprojet;

    @Column(name = "description")
    private String description;

    @Column(name = "datedebut")
    private Instant datedebut;

    @Column(name = "datefin")
    private Instant datefin;

    @ManyToOne
    @JsonIgnoreProperties(value = { "affectations" }, allowSetters = true)
    private Projet projet;

    @OneToMany(mappedBy = "affectation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "entretiens", "affectation", "affectationAdmin" }, allowSetters = true)
    private Set<Employee> employees = new HashSet<>();

    @OneToMany(mappedBy = "affectation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "affectation" }, allowSetters = true)
    private Set<Competance> competances = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Affectation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomprojet() {
        return this.nomprojet;
    }

    public Affectation nomprojet(String nomprojet) {
        this.setNomprojet(nomprojet);
        return this;
    }

    public void setNomprojet(String nomprojet) {
        this.nomprojet = nomprojet;
    }

    public String getDescription() {
        return this.description;
    }

    public Affectation description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDatedebut() {
        return this.datedebut;
    }

    public Affectation datedebut(Instant datedebut) {
        this.setDatedebut(datedebut);
        return this;
    }

    public void setDatedebut(Instant datedebut) {
        this.datedebut = datedebut;
    }

    public Instant getDatefin() {
        return this.datefin;
    }

    public Affectation datefin(Instant datefin) {
        this.setDatefin(datefin);
        return this;
    }

    public void setDatefin(Instant datefin) {
        this.datefin = datefin;
    }

    public Projet getProjet() {
        return this.projet;
    }

    public void setProjet(Projet projet) {
        this.projet = projet;
    }

    public Affectation projet(Projet projet) {
        this.setProjet(projet);
        return this;
    }

    public Set<Employee> getEmployees() {
        return this.employees;
    }

    public void setEmployees(Set<Employee> employees) {
        if (this.employees != null) {
            this.employees.forEach(i -> i.setAffectation(null));
        }
        if (employees != null) {
            employees.forEach(i -> i.setAffectation(this));
        }
        this.employees = employees;
    }

    public Affectation employees(Set<Employee> employees) {
        this.setEmployees(employees);
        return this;
    }

    public Affectation addEmployee(Employee employee) {
        this.employees.add(employee);
        employee.setAffectation(this);
        return this;
    }

    public Affectation removeEmployee(Employee employee) {
        this.employees.remove(employee);
        employee.setAffectation(null);
        return this;
    }

    public Set<Competance> getCompetances() {
        return this.competances;
    }

    public void setCompetances(Set<Competance> competances) {
        if (this.competances != null) {
            this.competances.forEach(i -> i.setAffectation(null));
        }
        if (competances != null) {
            competances.forEach(i -> i.setAffectation(this));
        }
        this.competances = competances;
    }

    public Affectation competances(Set<Competance> competances) {
        this.setCompetances(competances);
        return this;
    }

    public Affectation addCompetance(Competance competance) {
        this.competances.add(competance);
        competance.setAffectation(this);
        return this;
    }

    public Affectation removeCompetance(Competance competance) {
        this.competances.remove(competance);
        competance.setAffectation(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Affectation)) {
            return false;
        }
        return id != null && id.equals(((Affectation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Affectation{" +
            "id=" + getId() +
            ", nomprojet='" + getNomprojet() + "'" +
            ", description='" + getDescription() + "'" +
            ", datedebut='" + getDatedebut() + "'" +
            ", datefin='" + getDatefin() + "'" +
            "}";
    }
}
