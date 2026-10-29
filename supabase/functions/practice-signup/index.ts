const origin='https://gabkeunc-sys.github.io';
const cors={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin'};
const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(req.method!=='POST')return reply(405,{error:'POST 요청만 지원합니다.'});
 if(req.headers.get('origin')!==origin)return reply(403,{error:'허용되지 않은 출처입니다.'});
 try{
 const text=await req.text();if(text.length>2048)return reply(413,{error:'입력이 너무 깁니다.'});
 const {email,password}=JSON.parse(text);
 if(typeof email!=='string'||email.length>254||!/^\S+@\S+\.\S+$/.test(email.trim())||typeof password!=='string'||password.length<6||password.length>128)return reply(400,{error:'이메일과 6~128자 비밀번호를 입력해 주세요.'});
 const url=Deno.env.get('SUPABASE_URL'), key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 if(!url||!key)return reply(503,{error:'회원가입 서버를 준비 중입니다.'});
 const response=await fetch(url+'/auth/v1/admin/users',{method:'POST',headers:{'Authorization':'Bearer '+key,'apikey':key,'Content-Type':'application/json'},body:JSON.stringify({email:email.trim(),password,email_confirm:true})});
 const data=await response.json();
 if(!response.ok){const code=data.code||data.error_code;return reply(response.status===422?400:response.status,{error:code==='email_exists'||/already|registered/i.test(data.msg||data.message||'')?'이미 가입된 이메일입니다. 로그인해 주세요.':'회원가입에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.'});}
 return reply(201,{created:true});
 }catch{return reply(400,{error:'요청을 처리하지 못했습니다. 입력 내용을 확인해 주세요.'});}
});
