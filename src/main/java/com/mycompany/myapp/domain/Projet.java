package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
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

    @JsonIgnoreProperties(value = { "employee" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Affectation nomprojet;

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

    public Affectation getNomprojet() {
        return this.nomprojet;
    }

    public void setNomprojet(Affectation affectation) {
        this.nomprojet = affectation;
    }

    public Projet nomprojet(Affectation affectation) {
        this.setNomprojet(affectation);
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
