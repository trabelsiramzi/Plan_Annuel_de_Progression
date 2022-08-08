package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Responsable.
 */
@Entity
@Table(name = "responsable")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Responsable implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nommanager")
    private String nommanager;

    @Column(name = "nomteamlead")
    private String nomteamlead;

    @OneToMany(mappedBy = "responsable")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "responsable" }, allowSetters = true)
    private Set<Entretien> entretiens = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Responsable id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNommanager() {
        return this.nommanager;
    }

    public Responsable nommanager(String nommanager) {
        this.setNommanager(nommanager);
        return this;
    }

    public void setNommanager(String nommanager) {
        this.nommanager = nommanager;
    }

    public String getNomteamlead() {
        return this.nomteamlead;
    }

    public Responsable nomteamlead(String nomteamlead) {
        this.setNomteamlead(nomteamlead);
        return this;
    }

    public void setNomteamlead(String nomteamlead) {
        this.nomteamlead = nomteamlead;
    }

    public Set<Entretien> getEntretiens() {
        return this.entretiens;
    }

    public void setEntretiens(Set<Entretien> entretiens) {
        if (this.entretiens != null) {
            this.entretiens.forEach(i -> i.setResponsable(null));
        }
        if (entretiens != null) {
            entretiens.forEach(i -> i.setResponsable(this));
        }
        this.entretiens = entretiens;
    }

    public Responsable entretiens(Set<Entretien> entretiens) {
        this.setEntretiens(entretiens);
        return this;
    }

    public Responsable addEntretien(Entretien entretien) {
        this.entretiens.add(entretien);
        entretien.setResponsable(this);
        return this;
    }

    public Responsable removeEntretien(Entretien entretien) {
        this.entretiens.remove(entretien);
        entretien.setResponsable(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Responsable)) {
            return false;
        }
        return id != null && id.equals(((Responsable) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Responsable{" +
            "id=" + getId() +
            ", nommanager='" + getNommanager() + "'" +
            ", nomteamlead='" + getNomteamlead() + "'" +
            "}";
    }
}
