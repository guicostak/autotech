<div align="justify" >
      
# Test Plan AutoTech



## 1 Introdução

AutoTech é uma aplicação web e mobile desenvolvida para ser um marketplace online especializado em peças de carro, com foco em tecnologia e inovação, com o objetivo de facilitar a compra e venda de peças automotivas e atender à crescente demanda do mercado de reposição. A plataforma permite que usuários comprem e vendam peças de forma fácil e segura, conectando compradores e vendedores em um ambiente intuitivo e moderno. A plataforma visa ainda promover visibilidade para pequenos vendedores e indivíduos que comercializam itens usados, oferecendo um espaço digital que amplia o alcance de seus anúncios.





## 2 Arquitetura


A arquitetura do projeto é baseada na utilização do React Native e Next.js no Front-End, usando o Next.js para o desenvolvimento web e o React Native para a parte mobile. O Springboot foi escolhido para o desenvolvimento dos microsserviços, enquanto a mensageria será implementada utilizando RabbitMQ.
O PostgreSQL foi escolhido como o banco de dados principal devido à sua robustez, flexibilidade e confiabilidade, suportando grandes volumes de dados e alta demanda de acesso simultâneo. O Cache Redis será utilizado para melhorar o desempenho do sistema, armazenando dados temporários para consultas rápidas, reduzindo a carga sobre o banco de dados principal.





## 3 Funcionalidade


### 3.1	Mobile


| Funcionalidade | Cadastro |
| --- | --- |
| Comportamento Esperado | Ao preencher todos os campos obrigatórios, o usuário é redirecionado para o login. |
| Verificações | - Todos os campos devem ser obrigatórios.<br>- Exibir uma mensagem de confirmação em caso positivo.<br>- Redirecionar o usuário para tela de login.<br>- Exibir a mensagem de falha em caso de email já existente.<br>- Exibir mensagem de falha em caso de CPF já existente<br>- Exibir mensagem de falha no caso de campo obrigatório incompleto. |
| Critérios de Aceite | - Todos os campos devem ser obrigatórios.<br>- Exibir uma mensagem de confirmação em caso positivo.<br>- Redirecionar o usuário para a tela de login.<br>- Exibir mensagem de falha em caso de CPF já existente<br>- Exibir a mensagem de falha em caso de email já existente.<br>- Exibir mensagem de falha caso o campo obrigatório esteja incompleto. |

<br>


| Funcionalidade | Login |
| --- | --- |
| Comportamento Esperado | Ao digitar seu email e senha corretamente, o usuário irá logar na plataforma e será direcionado para a página inicial. |
| Verificações | - Login no Sistema com sucesso.<br>- Mensagem de erro para credenciais inválidas.<br>- Mensagem de erro de email não cadastrado.<br>- Usuário não preencheu campo obrigatório. |
| Critérios de Aceite | Ter acesso ao sistema. |

<br>


| Funcionalidade | Recuperação de Senha |
| --- | --- |
| Comportamento Esperado | O usuário recebe um e-mail com instruções para redefinir a senha. |
| Verificações | - Solicitação de recuperação de senha enviada com sucesso.<br>- Mensagem de falha se o e-mail não estiver registrado. |
| Critérios de Aceite | Usuário recebe instruções por e-mail para redefinição de senha com sucesso e consegue redefinir sua senha. |

<br>

| Funcionalidade | Completar Perfil como Usuário |
| --- | --- |
| Comportamento Esperado | Após o cadastro e o login, o usuário pode completar seu perfil com informações adicionais, como endereço de entrega, número de telefone e data de nascimento. |
| Verificações | - Salvamento de informações com sucesso.<br>- Mensagem de erro para campos obrigatórios não preenchidos.<br>- Notificação de confirmação após o preenchimento completo. |
| Critérios de Aceite | O usuário consegue adicionar e salvar suas informações adicionais de perfil, garantindo dados completos para conseguir anunciar na plataforma. |

<br>

| Funcionalidade | Completar Perfil como Loja |
| --- | --- |
| Comportamento Esperado | Após o cadastro e o login, usuários podem cadastrar sua loja, adicionando informações específicas, como nome da loja, CNPJ, endereço comercial, número de telefone e descrição da loja. |
| Verificações | - Salvamento de informações de loja com sucesso.<br>- Validação de CNPJ.<br>- Mensagem de erro para campos obrigatórios não preenchidos.<br>- Notificação de confirmação após o preenchimento completo. |
| Critérios de Aceite | O usuário consegue adicionar e salvar as informações da sua loja, tornando o perfil mais completo e confiável para os compradores e assim conseguindo anunciar na plataforma como loja. |

<br>


| Funcionalidade | Criação de Anúncios |
| --- | --- |
| Comportamento Esperado | O vendedor pode criar anúncios, incluir fotos, descrição, especificações e detalhes da peça. |
| Verificações | - Criação de anúncio com sucesso.<br>- Validação de fotos e campos obrigatórios.<br>- Mensagem de erro caso algum campo obrigatório não esteja preenchido. |
| Critérios de Aceite | O vendedor cria anúncios com informações detalhadas sobre a peça, incluindo fotos e especificações. |

<br>


| Funcionalidade | Processamento de Pagamento via Mercado Pago |
| --- | --- |
| Comportamento Esperado | Ao finalizar uma compra, o usuário é redirecionado para o checkout do Mercado Pago, onde pode escolher o método de pagamento (cartão de crédito, débito, PIX ou boleto). Após a confirmação de pagamento, o sistema recebe o status da transação e notifica o usuário sobre o sucesso ou falha do pagamento. |
| Verificações | - Redirecionamento para a plataforma de pagamento Mercado Pago.<br>- Confirmação de transação bem-sucedida e atualização do status da compra no sistema.<br>- Recebimento de notificação em caso de pagamento bem-sucedido ou falho.<br>- Validação de dados do pagamento no Mercado Pago.<br>- Exibição de mensagens de erro amigáveis ao usuário, caso o pagamento falhe. |
| Critérios de Aceite | O usuário consegue realizar o pagamento via Mercado Pago com sucesso e é notificado do status da transação. O sistema deve atualizar o status da compra conforme a resposta do Mercado Pago. |


### 3.2	Web

| Funcionalidade | Cadastro |
| --- | --- |
| Comportamento Esperado | Ao preencher todos os campos obrigatórios, o usuário é redirecionado para o login. |
| Verificações | - Todos os campos devem ser obrigatórios.<br>- Exibir uma mensagem de confirmação em caso positivo.<br>- Redirecionar o usuário para tela de login.<br>- Exibir a mensagem de falha em caso de email já existente.<br>- Exibir mensagem de falha em caso de CPF já existente<br>- Exibir mensagem de falha no caso de campo obrigatório incompleto. |
| Critérios de Aceite | - Todos os campos devem ser obrigatórios.<br>- Exibir uma mensagem de confirmação em caso positivo.<br>- Redirecionar o usuário para a tela de login.<br>- Exibir mensagem de falha em caso de CPF já existente<br>- Exibir a mensagem de falha em caso de email já existente.<br>- Exibir mensagem de falha caso o campo obrigatório esteja incompleto. |

<br>


| Funcionalidade | Login |
| --- | --- |
| Comportamento Esperado | Ao digitar seu email e senha corretamente, o usuário irá logar na plataforma e será direcionado para a página inicial. |
| Verificações | - Login no Sistema com sucesso.<br>- Mensagem de erro para credenciais inválidas.<br>- Mensagem de erro de email não cadastrado.<br>- Usuário não preencheu campo obrigatório. |
| Critérios de Aceite | Ter acesso ao sistema. |

<br>


| Funcionalidade | Recuperação de Senha |
| --- | --- |
| Comportamento Esperado | O usuário recebe um e-mail com instruções para redefinir a senha. |
| Verificações | - Solicitação de recuperação de senha enviada com sucesso.<br>- Mensagem de falha se o e-mail não estiver registrado. |
| Critérios de Aceite | Usuário recebe instruções por e-mail para redefinição de senha com sucesso e consegue redefinir sua senha. |

<br>

| Funcionalidade | Completar Perfil como Usuário |
| --- | --- |
| Comportamento Esperado | Após o cadastro e o login, o usuário pode completar seu perfil com informações adicionais, como endereço de entrega, número de telefone e data de nascimento. |
| Verificações | - Salvamento de informações com sucesso.<br>- Mensagem de erro para campos obrigatórios não preenchidos.<br>- Notificação de confirmação após o preenchimento completo. |
| Critérios de Aceite | O usuário consegue adicionar e salvar suas informações adicionais de perfil, garantindo dados completos para conseguir anunciar na plataforma. |

<br>

| Funcionalidade | Completar Perfil como Loja |
| --- | --- |
| Comportamento Esperado | Após o cadastro e o login, usuários podem cadastrar sua loja, adicionando informações específicas, como nome da loja, CNPJ, endereço comercial, número de telefone e descrição da loja. |
| Verificações | - Salvamento de informações de loja com sucesso.<br>- Validação de CNPJ.<br>- Mensagem de erro para campos obrigatórios não preenchidos.<br>- Notificação de confirmação após o preenchimento completo. |
| Critérios de Aceite | O usuário consegue adicionar e salvar as informações da sua loja, tornando o perfil mais completo e confiável para os compradores e assim conseguindo anunciar na plataforma como loja. |

<br>

| Funcionalidade | Criação de Anúncios |
| --- | --- |
| Comportamento Esperado | O usuário pode criar anúncios, incluir fotos, descrição, especificações e detalhes da peça se estiver completado seu perfil como usuário ou loja. |
| Verificações | - Criação de anúncio com sucesso.<br>- Validação de fotos e campos obrigatórios.<br>- Mensagem de erro caso algum campo obrigatório não esteja preenchido. |
| Critérios de Aceite | O usuário cria anúncios com informações detalhadas sobre a peça, incluindo fotos e especificações. |

<br>

| Funcionalidade | Processamento de Pagamento via Mercado Pago |
| --- | --- |
| Comportamento Esperado | Ao finalizar uma compra, o usuário é redirecionado para o checkout do Mercado Pago, onde pode escolher o método de pagamento (cartão de crédito, débito, PIX ou boleto). Após a confirmação de pagamento, o sistema recebe o status da transação e notifica o usuário sobre o sucesso ou falha do pagamento. |
| Verificações | - Redirecionamento para a plataforma de pagamento Mercado Pago.<br>- Confirmação de transação bem-sucedida e atualização do status da compra no sistema.<br>- Recebimento de notificação em caso de pagamento bem-sucedido ou falho.<br>- Validação de dados do pagamento no Mercado Pago.<br>- Exibição de mensagens de erro amigáveis ao usuário, caso o pagamento falhe. |
| Critérios de Aceite | O usuário consegue realizar o pagamento via Mercado Pago com sucesso e é notificado do status da transação. O sistema deve atualizar o status da compra conforme a resposta do Mercado Pago. |

## 4 Estratégia de Teste

### 4.1 Escopo de Testes

O plano de testes abrange todas as funcionalidades descritas na tabela acima. 

Serão executados testes nos níveis conforme a descrição abaixo.

Testes Unitários: o código terá uma cobertura de 50% de testes unitários, que são de responsabilidade dos desenvolvedores.
Testes Automatizados: Serão realizados testes end-to-end para todas as funcionalidades, responsabilidade do time de qualidade, seguindo a documentação de Cenários de teste e deste Test Plan.



### 4.2 Ambiente e Ferramentas

Os testes serão feitos no ambiente de produção.

As seguintes ferramentas serão utilizadas no teste:



| Ferramenta | Time | Descrição |
| --- | --- | --- |
| Cypress | Qualidade | Ferramenta para realização de testes na plataforma Web|
| Maestro | Qualidade | Ferramenta para realização de testes na plataforma Mobile|
| JUnit | Desenvolvimento | Framework utilizada para testes unitários |





## 5 Classificação de Bugs

Os Bugs serão classificados com as seguintes severidades:


| ID | Nível de Severidade | Descrição |
| --- | --- | --- |
| 1 | Blocker | Bug que bloqueia o teste de uma função ou feature causa crash na aplicação.<br>Botão não funciona impedindo o uso completo da funcionalidade.<br>Bloqueia a entrega. |
| 2 | Grave | Funcionalidade não funciona como o esperado.<br>Input incomum causa efeitos irreversíveis. |
| 3 | Moderada | Funcionalidade não atinge certos critérios de aceitação, mas sua funcionalidade em geral não é afetada.<br>Mensagem de erro ou sucesso não é exibida. |
| 4 | Pequena | Quase nenhum impacto na funcionalidade, porém atrapalha a experiência.<br>Erro ortográfico.<br>Pequenos erros de UI. |





## 6 Definição de Pronto 

Serão consideradas prontas as funcionalidades que passarem pelas verificações e testes descritas neste Test Plan, não apresentarem bugs com a severidade acima de Minor, e passarem por uma validação de negócio de responsabilidade do time de QA.
