
    // Logica de Login 
    document.getElementById('form-login').addEventListener('submit', function(e) {
      e.preventDefault(); 
      const usuarioDigitado = document.getElementById('usuario').value;
      const senhaDigitada = document.getElementById('senha').value;


      const USUARIO_CORRETO = "admin";
      const SENHA_CORRETA = "12345";

      if (usuarioDigitado === USUARIO_CORRETO && senhaDigitada === SENHA_CORRETA) {
        window.location.href = "menu.html"; 
      } else {
        alert("Usuário ou senha incorretos!");
        document.getElementById('senha').value = ""; 
      }
    });
