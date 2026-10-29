export async function register(client,creds) {
 const response=await fetch('https://tngyafnlufaaexiqvgdi.supabase.co/functions/v1/practice-signup',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ3lhZm5sdWZhYWV4aXF2Z2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMzYxNzksImV4cCI6MjEwODgxMjE3OX0.e18ZuK84fCIUs1e-mU-z81mLI0Ornq7faEshW-6tX68','apikey':'sb_publishable_s1ylhSJ01XbMuitoSrSCqQ_mQZjrTBg'},body:JSON.stringify(creds)});
 const body=await response.json();
 if(!response.ok)throw Error(body.error||body.message||'회원가입에 실패했습니다.');
 return client.auth.signInWithPassword(creds);
}

