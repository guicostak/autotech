package com.msanunciospedidos.autotech.app.service.anuncio;

import com.msanunciospedidos.autotech.app.domain.AnuncioDomainEntity;
import com.msanunciospedidos.autotech.app.domain.enums.TipoAnuncioPesquisa;
import org.springframework.data.jpa.domain.Specification;

public class AnuncioSpecification {

    public static Specification<AnuncioDomainEntity> hasTitulo(String titulo) {
        return (root, query, builder) -> {
            if (titulo == null || titulo.isEmpty()) {
                return null;
            }
            return builder.equal(builder.lower(root.get("titulo")), titulo.toLowerCase());
        };
    }

    public static Specification<AnuncioDomainEntity> hasMarca(String marca) {
        return (root, query, builder) -> {
            if (marca == null || marca.isEmpty()) {
                return null;
            }
            return builder.equal(builder.lower(root.get("marca")), marca.toLowerCase());
        };
    }

    public static Specification<AnuncioDomainEntity> hasModelo(String modelo) {
        return (root, query, builder) -> {
            if (modelo == null || modelo.isEmpty()) {
                return null;
            }
            return builder.equal(builder.lower(root.get("modelo")), modelo.toLowerCase());
        };
    }

    public static Specification<AnuncioDomainEntity> hasCategoria(String categoria) {
        return (root, query, builder) -> {
            if (categoria == null || categoria.isEmpty()) {
                return null;
            }
            return builder.equal(builder.lower(root.get("categoria")), categoria.toLowerCase());
        };
    }

    public static Specification<AnuncioDomainEntity> hasPrecoBetween(Double precoMin, Double precoMax) {
        return (root, query, builder) -> {
            if (precoMin == null && precoMax == null) {
                return null;
            }
            if (precoMin != null && precoMax != null) {
                return builder.between(root.get("preco"), precoMin, precoMax);
            } else if (precoMin != null) {
                return builder.greaterThanOrEqualTo(root.get("preco"), precoMin);
            } else {
                return builder.lessThanOrEqualTo(root.get("preco"), precoMax);
            }
        };
    }

    public static Specification<AnuncioDomainEntity> hasAnoFabricacao(Integer anoFabricacao) {
        return (root, query, builder) -> {
            if (anoFabricacao == null) {
                return null;
            }
            return builder.equal(root.get("anoFabricacao"), anoFabricacao);
        };
    }

    public static Specification<AnuncioDomainEntity> isAtivo() {
        return (root, query, builder) -> builder.isTrue(root.get("ativo"));
    }

    public static Specification<AnuncioDomainEntity> hasValorPesquisado(String valorPesquisado) {
        return (root, query, builder) -> {
            if (valorPesquisado == null || valorPesquisado.isEmpty()) {
                return null;
            }
            String likePattern = "%" + valorPesquisado.toLowerCase() + "%";
            return builder.or(
                    builder.like(builder.lower(root.get("titulo")), likePattern),
                    builder.like(builder.lower(root.get("modelo")), likePattern),
                    builder.like(builder.lower(root.get("categoria")), likePattern),
                    builder.like(builder.lower(root.get("marca")), likePattern)
            );
        };
    }

    public static Specification<AnuncioDomainEntity> tipoAnuncioEspecificacao(TipoAnuncioPesquisa tipoAnuncio) {
        return (root, query, criteriaBuilder) -> {
            if (tipoAnuncio == TipoAnuncioPesquisa.AMBOS) {
                return criteriaBuilder.conjunction();
            } else if (tipoAnuncio == TipoAnuncioPesquisa.PROFISSIONAL) {
                return criteriaBuilder.isNotNull(root.get("vendedor"));
            } else if (tipoAnuncio == TipoAnuncioPesquisa.AMADOR) {
                return criteriaBuilder.isNull(root.get("vendedor"));
            }
            return null;
        };
    }
}
