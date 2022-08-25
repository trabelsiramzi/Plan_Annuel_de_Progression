package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Projet.
 */
@Entity
@Table(name = "projet")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Projet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "titreprojet")
    private String titreprojet;

    @OneToMany(mappedBy = "projet")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "projet", "employees", "competances" }, allowSetters = true)
    private Set<Affectation> affectations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Projet id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitreprojet() {
        return this.titreprojet;
    }

    public Projet titreprojet(String titreprojet) {
        this.setTitreprojet(titreprojet);
        return this;
    }

    public void setTitreprojet(String titreprojet) {
        this.titreprojet = titreprojet;
    }

    public Set<Affectation> getAffectations() {
        return this.affectations;
    }

    public void setAffectations(Set<Affectation> affectations) {
        if (this.affectations != null) {
            this.affectations.forEach(i -> i.setProjet(null));
        }
        if (affectations != null) {
            affectations.forEach(i -> i.setProjet(this));
        }
        this.affectations = affectations;
    }

    public Projet affectations(Set<Affectation> affectations) {
        this.setAffectations(affectations);
        return this;
    }

    public Projet addAffectation(Affectation affectation) {
        this.affectations.add(affectation);
        affectation.setProjet(this);
        return this;
    }

    public Projet removeAffectation(Affectation affectation) {
        this.affectations.remove(affectation);
        affectation.setProjet(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Projet)) {
            return false;
        }
        return id != null && id.equals(((Projet) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Projet{" +
            "id=" + getId() +
            ", titreprojet='" + getTitreprojet() + "'" +
            "}";
    }
}
