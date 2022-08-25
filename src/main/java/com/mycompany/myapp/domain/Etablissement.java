package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Etablissement.
 */
@Entity
@Table(name = "etablissement")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Etablissement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nometablissement")
    private String nometablissement;

    @Column(name = "manager")
    private Long manager;

    @Column(name = "teamlead")
    private Long teamlead;

    @ManyToOne
    @JsonIgnoreProperties(value = { "managers", "teamleads", "employees" }, allowSetters = true)
    private AffectationAdmin manager;

    @ManyToOne
    @JsonIgnoreProperties(value = { "managers", "teamleads", "employees" }, allowSetters = true)
    private AffectationAdmin teamlead;

    @OneToMany(mappedBy = "etablissement")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "entretiens", "affectation", "etablissement", "affectationAdmin" }, allowSetters = true)
    private Set<Employee> employees = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Etablissement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNometablissement() {
        return this.nometablissement;
    }

    public Etablissement nometablissement(String nometablissement) {
        this.setNometablissement(nometablissement);
        return this;
    }

    public void setNometablissement(String nometablissement) {
        this.nometablissement = nometablissement;
    }

    public Long getManager() {
        return this.manager;
    }

    public Etablissement manager(Long manager) {
        this.setManager(manager);
        return this;
    }

    public void setManager(Long manager) {
        this.manager = manager;
    }

    public Long getTeamlead() {
        return this.teamlead;
    }

    public Etablissement teamlead(Long teamlead) {
        this.setTeamlead(teamlead);
        return this;
    }

    public void setTeamlead(Long teamlead) {
        this.teamlead = teamlead;
    }

    public AffectationAdmin getManager() {
        return this.manager;
    }

    public void setManager(AffectationAdmin affectationAdmin) {
        this.manager = affectationAdmin;
    }

    public Etablissement manager(AffectationAdmin affectationAdmin) {
        this.setManager(affectationAdmin);
        return this;
    }

    public AffectationAdmin getTeamlead() {
        return this.teamlead;
    }

    public void setTeamlead(AffectationAdmin affectationAdmin) {
        this.teamlead = affectationAdmin;
    }

    public Etablissement teamlead(AffectationAdmin affectationAdmin) {
        this.setTeamlead(affectationAdmin);
        return this;
    }

    public Set<Employee> getEmployees() {
        return this.employees;
    }

    public void setEmployees(Set<Employee> employees) {
        if (this.employees != null) {
            this.employees.forEach(i -> i.setEtablissement(null));
        }
        if (employees != null) {
            employees.forEach(i -> i.setEtablissement(this));
        }
        this.employees = employees;
    }

    public Etablissement employees(Set<Employee> employees) {
        this.setEmployees(employees);
        return this;
    }

    public Etablissement addEmployee(Employee employee) {
        this.employees.add(employee);
        employee.setEtablissement(this);
        return this;
    }

    public Etablissement removeEmployee(Employee employee) {
        this.employees.remove(employee);
        employee.setEtablissement(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Etablissement)) {
            return false;
        }
        return id != null && id.equals(((Etablissement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Etablissement{" +
            "id=" + getId() +
            ", nometablissement='" + getNometablissement() + "'" +
            ", manager=" + getManager() +
            ", teamlead=" + getTeamlead() +
            "}";
    }
}
