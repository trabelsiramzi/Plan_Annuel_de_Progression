package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EntretienTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Entretien.class);
        Entretien entretien1 = new Entretien();
        entretien1.setId(1L);
        Entretien entretien2 = new Entretien();
        entretien2.setId(entretien1.getId());
        assertThat(entretien1).isEqualTo(entretien2);
        entretien2.setId(2L);
        assertThat(entretien1).isNotEqualTo(entretien2);
        entretien1.setId(null);
        assertThat(entretien1).isNotEqualTo(entretien2);
    }
}
