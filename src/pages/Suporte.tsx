
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, HeadphonesIcon, Paperclip } from 'lucide-react';

const Suporte = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
    anexo: null as File | null
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      assunto: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      anexo: file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio do formulário
    toast({
      title: "Mensagem enviada!",
      description: "Sua mensagem foi enviada com sucesso. Retornaremos o contato em breve."
    });
    setFormData({
      nome: '',
      email: '',
      assunto: '',
      mensagem: '',
      anexo: null
    });
  };

  const handleCancel = () => {
    setFormData({
      nome: '',
      email: '',
      assunto: '',
      mensagem: '',
      anexo: null
    });
  };

  return (
    <div className="p-6 px-0 py-0">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <HeadphonesIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Suporte</h1>
            <p className="text-gray-600 text-lg">Precisa de ajuda? Entre em contato com nossa equipe de suporte</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Formulário de Contato */}
        <div className="lg:col-span-2 flex">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Entre em contato</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <Input 
                      id="nome" 
                      name="nome" 
                      type="text" 
                      placeholder="Seu nome" 
                      value={formData.nome} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="seu.email@exemplo.com" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto *
                  </label>
                  <Select value={formData.assunto} onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o assunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cancelar-plano">Desejo cancelar o meu plano</SelectItem>
                      <SelectItem value="funcao-nao-funciona">Uma função não está funcionando corretamente</SelectItem>
                      <SelectItem value="sugestao">Quero fazer uma sugestão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem *
                  </label>
                  <Textarea 
                    id="mensagem" 
                    name="mensagem" 
                    placeholder="Descreva detalhadamente como podemos ajudar..." 
                    rows={6} 
                    value={formData.mensagem} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div>
                  <label htmlFor="anexo" className="block text-sm font-medium text-gray-700 mb-1">
                    Anexo (opcional)
                  </label>
                  <div className="relative">
                    <Input 
                      id="anexo" 
                      name="anexo" 
                      type="file" 
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <Paperclip className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Envie prints, documentos ou arquivos que possam ajudar no atendimento (máx. 10MB)
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Enviar mensagem
                  </Button>
                </div>
              </form>
              
              {/* Texto informativo */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> O atendimento pode demorar para responder, principalmente em finais de semana. 
                  A resposta se dará principalmente por email.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações de Contato e FAQ */}
        <div className="flex flex-col space-y-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Informações de contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">contato@anye.com.br</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Telefone</h3>
                <p className="text-gray-600">(33) 98898-0067</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Horário de atendimento</h3>
                <p className="text-gray-600">Segunda a sexta: 9h às 18h</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Por que meu produto demora a ter preço e estoque atualizado na Amazon?</h3>
                <p className="text-gray-600 text-sm">
                  A Amazon processa tudo de forma relativamente lenta, podendo levar de 20 a 40 minutos para alterações de preço e estoque sejam refletidas.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Quanto tempo leva para sincronizar produtos?</h3>
                <p className="text-gray-600 text-sm">
                  A sincronização de produtos geralmente leva de 5 a 15 minutos, dependendo da quantidade.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Suporte;
