# node-redis-caching  

how to use redis for caching server?  
[https://darrengwon.tistory.com/1078](https://darrengwon.tistory.com/1078)  

## 핵심 아이디어
- 결과물을 redis에 저장해준다. caching invalidation을 위한 ttl 설정을 잊지 말자  
- 다음 요청 시에 미들웨어에서 redis에 저장된 값이 있다면 해당 내용을 사용하고 바로 return해버려서 실제 함수까지 도달하지 않게끔하면 된다.  

 

