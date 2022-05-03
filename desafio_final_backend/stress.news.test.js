import { check } from 'k6';
import http from 'k6/http';

const timing = 5000

export const options = {
  stages: [
    { duration: '10s', target: 50 },
  ],
};


export default function () {
  // const res = http.get(url);

  const req1 = {
    method: 'GET',
    url: 'http://localhost:3000/news',
  }

  const req2 = {
    method: 'GET',
    url: 'http://localhost:3000/news/62711572e0d13364882cab8a',
  }
  
  const req3 = {
    method: 'POST',
    url: 'http://localhost:3000/news',
    body: JSON.stringify({
        title: "Título da Notícia",
        body: "Corpo da notícia."
    }),
    params: {
      headers: { 'Content-Type': 'application/json' },
    },
  }

  const responses = http.batch([req1, req2, req3])

  for (let index = 0; index < responses.length; index++) {
    const element = responses[index];
    check(element, {
      'is status 200 or 201': (r) => r.status === 200 || 201,
      'is timings request duration': (r) => r.timings.duration <= timing,
    })
  }

}