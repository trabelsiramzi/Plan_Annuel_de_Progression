package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
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

    @ManyToOne
    @JsonIgnoreProperties(value = { "projet", "employees", "competances" }, allowSetters = true)
    private Affectation affectation;

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

    public Affectation getAffectation() {
        return this.affectation;
    }

    public void setAffectation(Affectation affectation) {
        this.affectation = affectation;
    }

    public Competance affectation(Affectation affectation) {
        this.setAffectation(affectation);
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
