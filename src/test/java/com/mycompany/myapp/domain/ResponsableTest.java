package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ResponsableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Responsable.class);
        Responsable responsable1 = new Responsable();
        responsable1.setId(1L);
        Responsable responsable2 = new Responsable();
        responsable2.setId(responsable1.getId());
        assertThat(responsable1).isEqualTo(responsable2);
        responsable2.setId(2L);
        assertThat(responsable1).isNotEqualTo(responsable2);
        responsable1.setId(null);
        assertThat(responsable1).isNotEqualTo(responsable2);
    }
}
