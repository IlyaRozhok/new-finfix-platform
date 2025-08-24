#!/bin/bash

cd backend && npm run start:dev &
cd frontend && npm run dev &
wait