import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const relationships = {
  Family: ['brother-brother', 'sister-sister', 'brother-sister', 'mother-son', 'mother-daughter', 'father-son', 'father-daughter'],
  Romantic: ['new-dating', 'long-term-partners', 'engaged', 'married'],
  Friends: ['best-friends-same', 'best-friends-different', 'new-friends', 'childhood-friends'],
  Other: ['colleagues', 'mentor-mentee', 'roommates', 'neighbors'],
};

const relationshipLabels = {
  'brother-brother': 'Brother & Brother',
  'sister-sister': 'Sister & Sister',
  'brother-sister': 'Brother & Sister',
  'mother-son': 'Mother & Son',
  'mother-daughter': 'Mother & Daughter',
  'father-son': 'Father & Son',
  'father-daughter': 'Father & Daughter',
  'new-dating': 'New Dating Couple',
  'long-term-partners': 'Long-term Partners',
  'engaged': 'Engaged Couple',
  'married': 'Married Couple',
  'best-friends-same': 'Best Friends (Same Gender)',
  'best-friends-different': 'Best Friends (Different Gender)',
  'new-friends': 'New Friends',
  'childhood-friends': 'Childhood Friends Reconnecting',
  'colleagues': 'Colleagues',
  'mentor-mentee': 'Mentor & Mentee',
  'roommates': 'Roommates',
  'neighbors': 'Neighbors',
};

export default function RelationshipScreen({ onSelectRelationship, onBack }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Choose Your Relationship</Text>
      <Text style={styles.subtitle}>Select the relationship type that best describes you</Text>

      <ScrollView style={styles.scrollView}>
        {Object.entries(relationships).map(([category, items]) => (
          <View key={category} style={styles.categoryContainer}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => setExpandedCategory(expandedCategory === category ? null : category)}
            >
              <Text style={styles.categoryTitle}>{category}</Text>
              <Text style={styles.dropdownIcon}>{expandedCategory === category ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {expandedCategory === category && (
              <View style={styles.categoryContent}>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.relationshipButton}
                    onPress={() => onSelectRelationship(item)}
                  >
                    <Text style={styles.relationshipButtonText}>{relationshipLabels[item]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: '#6c63ff',
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: 10,
  },
  categoryHeader: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  dropdownIcon: {
    fontSize: 16,
    color: '#6c63ff',
  },
  categoryContent: {
    marginTop: 10,
    gap: 8,
  },
  relationshipButton: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  relationshipButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
