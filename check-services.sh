#!/bin/bash

echo "🔍 Checking Running Services..."
echo "================================"

# Check Spring Boot (port 8080)
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ Spring Boot Backend: Running on port 8080"
    echo "   Database: http://localhost:8080/h2-console"
else
    echo "❌ Spring Boot Backend: Not running"
fi

# Check Node.js Backend (port 3001)  
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Node.js Backend: Running on port 3001"
else
    echo "❌ Node.js Backend: Not running"
fi

# Check Frontend (port 3000)
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: Running on port 3000"
else
    echo "❌ Frontend: Not running"
fi

echo ""
echo "📝 Commands to start:"
echo "   Spring Boot: cd backend && mvn spring-boot:run"
echo "   Node.js:     cd loanify-backend && npm run dev"  
echo "   Frontend:    npm run dev"