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
 * The Employee entity.
 */
@Schema(description = "The Employee entity.")
@Entity
@Table(name = "employee")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * The firstname attribute.
     */
    @Schema(description = "The firstname attribute.")
    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "email")
    private String email;

    @Column(name = "numtel")
    private String numtel;

    @Column(name = "dateembauche")
    private Instant dateembauche;

    @OneToMany(mappedBy = "employee")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "employee" }, allowSetters = true)
    private Set<Affectation> nomprojets = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "nomprojets", "manager" }, allowSetters = true)
    private Employee manager;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Employee id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Employee nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Employee prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return this.email;
    }

    public Employee email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNumtel() {
        return this.numtel;
    }

    public Employee numtel(String numtel) {
        this.setNumtel(numtel);
        return this;
    }

    public void setNumtel(String numtel) {
        this.numtel = numtel;
    }

    public Instant getDateembauche() {
        return this.dateembauche;
    }

    public Employee dateembauche(Instant dateembauche) {
        this.setDateembauche(dateembauche);
        return this;
    }

    public void setDateembauche(Instant dateembauche) {
        this.dateembauche = dateembauche;
    }

    public Set<Affectation> getNomprojets() {
        return this.nomprojets;
    }

    public void setNomprojets(Set<Affectation> affectations) {
        if (this.nomprojets != null) {
            this.nomprojets.forEach(i -> i.setEmployee(null));
        }
        if (affectations != null) {
            affectations.forEach(i -> i.setEmployee(this));
        }
        this.nomprojets = affectations;
    }

    public Employee nomprojets(Set<Affectation> affectations) {
        this.setNomprojets(affectations);
        return this;
    }

    public Employee addNomprojet(Affectation affectation) {
        this.nomprojets.add(affectation);
        affectation.setEmployee(this);
        return this;
    }

    public Employee removeNomprojet(Affectation affectation) {
        this.nomprojets.remove(affectation);
        affectation.setEmployee(null);
        return this;
    }

    public Employee getManager() {
        return this.manager;
    }

    public void setManager(Employee employee) {
        this.manager = employee;
    }

    public Employee manager(Employee employee) {
        this.setManager(employee);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Employee)) {
            return false;
        }
        return id != null && id.equals(((Employee) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Employee{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", email='" + getEmail() + "'" +
            ", numtel='" + getNumtel() + "'" +
            ", dateembauche='" + getDateembauche() + "'" +
            "}";
    }
}
