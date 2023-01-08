from django.urls import path, include
from base.views.transactionViews import createTransaction, getAllTransactions, getSingleTransaction, updateTransaction, deleteTransaction, removeParticipant, updateParticipant

urlpatterns = [
    path("all-transactions/<str:query>/",
         getAllTransactions, name="all-transactions"),
    path("create/", createTransaction, name="create-transaction"),
    path("<str:pk>/", getSingleTransaction, name="single-transaction"),
    path("<str:pk>/update/", updateTransaction, name="update-transaction"),
    path("<str:pk>/delete/", deleteTransaction, name="delete-transaction"),
    path("participants/<str:pk>/remove/",
         removeParticipant, name="remove-participant"),
    path("participants/<str:pk>/update/",
         updateParticipant, name="update-participant")
]
