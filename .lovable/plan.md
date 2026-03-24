

## Plano: Adicionar "Studio Mets" no footer

Editar o footer em `src/pages/Index.tsx` (linhas 414-418) para incluir "Studio Mets" como empresa mãe, abaixo ou junto ao texto existente.

### Mudança

No footer atual:
```
PROJETO 80+
Mova-se enquanto há tempo · © 2025
```

Ficará:
```
PROJETO 80+
Mova-se enquanto há tempo · © 2025
Uma marca Studio Mets
```

O texto "Studio Mets" será adicionado como uma terceira linha no footer, com fonte menor e opacidade reduzida para hierarquia visual.

### Arquivo
- `src/pages/Index.tsx` — adicionar `<div>` com "Uma marca Studio Mets" dentro do `<footer>`.

