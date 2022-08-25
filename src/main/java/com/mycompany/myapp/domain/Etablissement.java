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

    @OneToMany(mappedBy = "etablissement")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "etablissement", "employees" }, allowSetters = true)
    private Set<AffectationAdmin> affectationAdmins = new HashSet<>();

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

    public Set<AffectationAdmin> getAffectationAdmins() {
        return this.affectationAdmins;
    }

    public void setAffectationAdmins(Set<AffectationAdmin> affectationAdmins) {
        if (this.affectationAdmins != null) {
            this.affectationAdmins.forEach(i -> i.setEtablissement(null));
        }
        if (affectationAdmins != null) {
            affectationAdmins.forEach(i -> i.setEtablissement(this));
        }
        this.affectationAdmins = affectationAdmins;
    }

    public Etablissement affectationAdmins(Set<AffectationAdmin> affectationAdmins) {
        this.setAffectationAdmins(affectationAdmins);
        return this;
    }

    public Etablissement addAffectationAdmin(AffectationAdmin affectationAdmin) {
        this.affectationAdmins.add(affectationAdmin);
        affectationAdmin.setEtablissement(this);
        return this;
    }

    public Etablissement removeAffectationAdmin(AffectationAdmin affectationAdmin) {
        this.affectationAdmins.remove(affectationAdmin);
        affectationAdmin.setEtablissement(null);
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
